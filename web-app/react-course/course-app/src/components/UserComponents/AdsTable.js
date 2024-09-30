import React from "react";

export const AdsTable = ({ ads }) => {
  return (
    <div className="ads-card">
      <div className="ads-card-body">
        <div className="ads-table-responsive">
          <table className="ads-table">
            <thead>
              <tr>
                <th>
                  <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                    <input type="checkbox" className="form-check-input" id="checkAll" />
                    <label className="form-check-label" htmlFor="checkAll"></label>
                  </div>
                </th>
                <th>Name Advertisement</th>
                <th>Image</th>
                <th>Type</th>
                <th>Location</th>
                <th>Customer</th>
                <th>Status</th>
                <th>CreatedAt</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="ads-table-row">
                  <td>
                    <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                      <input type="checkbox" className="form-check-input" id={`check${ad.id}`} />
                      <label className="form-check-label" htmlFor={`check${ad.id}`}></label>
                    </div>
                  </td>
                  <td>{ad.name}</td>
                  <td>
                    <img src={ad.image} alt={ad.name} className="ads-img" />
                  </td>
                  <td>{ad.type}</td>
                  <td>{ad.placement}</td>
                  <td>{ad.customer}</td>
                  <td>
                    <span className={`ads-badge ${ad.status === "Approved" ? "ads-badge-success" : ad.status === "Pending" ? "ads-badge-warning" : "ads-badge-danger"}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td>{ad.make}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
