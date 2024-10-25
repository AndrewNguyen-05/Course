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
                                <th>Title</th>
                                <th>Image</th>
                                <th>Location</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
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
                                    <td>{ad.title}</td>
                                    <td>
                                        <img src={ad.imageUrl} alt={ad.title} className="ads-img" />
                                    </td>
                                    <td>{ad.location}</td>
                                    <td>{ad.contactEmail}</td>
                                    <td>{ad.contactPhone}</td>
                                    <td>
                                        <span className={`ads-badge 
                                         ${ad.status === "PENDING" ? "ads-badge-warning" :
                                           ad.status === "AWAITING_PAYMENT" ? "ads-badge-info" :
                                           ad.status === "ACTIVE" ? "ads-badge-primary" :
                                           ad.status === "COMPLETED" ? "ads-badge-success" :
                                           ad.status === "CANCELLED" ? "ads-badge-secondary" :
                                           ad.status === "REJECTED" ? "ads-badge-danger" : ""}`}>
                                        {ad.status}
                                        </span>
                                    </td>

                                    <td>{ad.startDate}</td>
                                    <td>{ad.endDate}</td>
                                    <td>{ad.createAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
