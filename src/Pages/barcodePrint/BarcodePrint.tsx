import React, { useState, useRef, useEffect } from "react";
import { Container, TextInput, NumberInput, Select, Button, Card, Group, FileInput, CloseButton, Loader } from "@mantine/core";
import { ReactBarcode } from "react-jsbarcode";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { getBillingLeanItemsAPI } from "../../utils/apiUtils";

const units = ["Kg", "Gm", "Piece", "mL", "L", "mm", "in", "mts"];

const ProductForm = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [itemsByBarcode, setItemsByBarcode] = useState<any>();
    const [loaderDisplay, setLoaderDisplay] = useState<boolean>(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mrp: "",
        packetQty: "",
        unit: ""
    });
    const printRef = useRef<any>(null);
    const singlePrintRef = useRef<any>(null);

    const getAllLeanItems = async () => {
        try {
            setLoaderDisplay(true);
            const response = await getBillingLeanItemsAPI();

            if (response.isError) return;
            if (response?.message) {
                setItemsByBarcode(response?.message?.itemsBarCodeMap);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoaderDisplay(false);
        }
    };

    useEffect(() => {
        getAllLeanItems();
    }, []);

    const generateUniqueBarcode = (existingBarcodes: string[]): string => {
        let newBarcode;
        do {
            newBarcode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        } while (existingBarcodes.includes(newBarcode));
        return newBarcode;
    };

    const handleAddProduct = () => {
        if (!formData.name || !formData.mrp || !formData.packetQty || !formData.unit) return;
        const newBarcode = generateUniqueBarcode(Object.keys(itemsByBarcode || {}));
        setProducts([...products, {
            id: uuidv4(),
            name: formData.name,
            mrp: Number(formData.mrp),
            packetQty: Number(formData.packetQty),
            unit: formData.unit,
            barcode: newBarcode
        }]);
        setFormData({ name: "", mrp: "", packetQty: "", unit: "" });
    };

    const handleRemoveProduct = (id: string) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleCSVUpload = (file: File | null) => {
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const newProducts = (results.data as any[]).map((row) => ({
                    id: uuidv4(),
                    name: row.ItemName || "",
                    mrp: Number(row.MRP) || 0,
                    packetQty: Number(row["Pkt.Qty"]) || 0,
                    unit: row.Unit || "",
                    barcode: generateUniqueBarcode(products.map(p => p.barcode)),
                })).filter(p => p.name && p.mrp && p.packetQty && p.unit);
                setProducts([...products, ...newProducts]);
            }
        });
    };

    const printCard = (id: string) => {
        setIsPrinting(true);
        setTimeout(() => {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                const printWindow = window.open('', '', 'width=60,height=600');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Print</title></head><body>');
                    printWindow.document.write(card.innerHTML);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                }
            }
            setIsPrinting(false);
        }, 100);
    };

    const printAllCards = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    return (
        <Container>
            {!isPrinting && <>
                <h2>Product Form</h2>
                <TextInput label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <NumberInput label="MRP" value={Number(formData.mrp)} onChange={(value) => setFormData({ ...formData, mrp: value?.toString() || "" })} />
                <NumberInput label="Packet Qty." value={Number(formData.packetQty)} onChange={(value) => setFormData({ ...formData, packetQty: value?.toString() || "" })} />
                <Select label="Unit" data={units} value={formData.unit} onChange={(value) => setFormData({ ...formData, unit: value || "" })} />
                <Button onClick={handleAddProduct} mt={10}>Add Product</Button>
                <FileInput label="Upload CSV" accept=".csv" onChange={handleCSVUpload} mt={20} />
                <Button onClick={printAllCards} mt={10} color="red">Print All Labels</Button>
            </>}
            <h3>Product List</h3>
            <div ref={printRef}>
                {products.map((product) => (
                    <Card key={product.id} shadow="sm" mt={10} id={`card-${product.id}`}> 
                        <Group justify="space-between">
                            <div>
                                <h4>{product.name}</h4>
                                <p>MRP: {product.mrp}</p>
                                <p>Packet Qty: {product.packetQty} {product.unit}</p>
                                <ReactBarcode value={product.barcode} options={{ format: "CODE128" }} />
                            </div>
                            {!isPrinting && <CloseButton onClick={() => handleRemoveProduct(product.id)} />}
                        </Group>
                        {!isPrinting && <Button onClick={() => printCard(product.id)} mt={10}>Print Label</Button>}
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default ProductForm;
