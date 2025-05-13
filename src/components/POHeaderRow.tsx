export const POHeaderRow: React.FC<{ numeric: string }> = ({ numeric }) => (
    <tr>
      <td />
      <th>Dealer&nbsp;Name</th>
      <th>Purchase&nbsp;Date</th>
      <th className={numeric}>CP</th>
      <th className={numeric}>SP</th>
      <th>MFG&nbsp;Date</th>
      <th>Expiry&nbsp;Date</th>
      <th className={numeric}>Initial&nbsp;Qty</th>
      <th className={numeric}>Current&nbsp;Stock</th>
    </tr>
  );
  