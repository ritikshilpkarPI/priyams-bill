import './SlabPricingTable.css';

export const SlabPricingTable = ({ data = [] }) => {
  const hasData = data.length;
  const lastData = data?.at(-1);
  return (
    <table className="slab-table" width="100px">
      <thead>
        <tr className="slab-table-heading-row">
          <th className="slab-table-cell">Qty</th>
          <th className="slab-table-cell">Price</th>
        </tr>
      </thead>
      <tbody>
        {hasData > 1 &&
          data?.slice(0, hasData - 1)?.map(([from, to, price], idx) => (
            <tr key={idx} className="slab-table-body-row">
              <td className="slab-table-cell">
                {from}-{to}
              </td>
              <td className="slab-table-cell price-align">{price}</td>
            </tr>
          ))}
        <tr className="slab-table-body-row">
          <td className="slab-table-cell">{lastData[0]}+</td>
          <td className="slab-table-cell price-align">{lastData[2]}</td>
        </tr>
      </tbody>
    </table>
  );
};
