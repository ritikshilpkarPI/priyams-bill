import './SlabPricingTable.css';

export const SlabPricingTable = ({slabList = []}:{ slabList: number[][] }) => {
  const slabsLength = slabList.length;
  const lastSlab = slabList?.at(-1) || [];
  return (
    <table className="slab-table" width="100px">
      <thead>
        <tr className="slab-table-heading-row">
          <th className="slab-table-cell">Qty</th>
          <th className="slab-table-cell">Price</th>
        </tr>
      </thead>
      <tbody>
        {slabsLength > 1 &&
          slabList
            ?.slice(0, slabsLength - 1)
            ?.map(([from, to, price]: number[], idx) => (
              <tr key={idx} className="slab-table-body-row">
                <td className="slab-table-cell">
                  {from}-{to}
                </td>
                <td className="slab-table-cell price-align">{price}</td>
              </tr>
            ))}
        <tr className="slab-table-body-row">
          <td className="slab-table-cell">{lastSlab[0]}+</td>
          <td className="slab-table-cell price-align">{lastSlab[2]}</td>
        </tr>
      </tbody>
    </table>
  );
};
