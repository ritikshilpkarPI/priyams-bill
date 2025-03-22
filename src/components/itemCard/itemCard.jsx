import { Button, Card, NumberInput } from "@mantine/core"

export const ItemCard = ({

}) => {
    return (
        <Card w="100%" withBorder p="md" >
            <div>
                <div>Qqwertyuiop</div>
                <div>
                    <div>Qqwertyuiop</div>
                    <div>Qqwertyuiop</div>
                </div>
            </div>
            <div>
                <Button>-</Button>
                <NumberInput/>
                <Button>+</Button>
            </div>
        </Card>
    )
}