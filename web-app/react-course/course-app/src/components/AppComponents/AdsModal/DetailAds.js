import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaLink, FaRegFileAlt } from 'react-icons/fa';

const AdsDetail = () => {
    const adData = {
        contactEmail: 'example@company.com',
        contactPhone: '+123456789',
        title: '50% Off Summer Sale',
        description: 'Get the best discounts on summer collections. Limited time offer!',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5nEzmC6YYbWDRE3OYu81r_SC0SvaZEzTh7A&s',
        location: '123 Fashion Street, New York, USA',
        link: 'https://www.example.com',
        startDate: '2024-10-01',
        endDate: '2024-11-01',
        status: 'Active',
        createdAt: '2024-09-28',
    };

    return (
        <div className="deltail-ads-modal">
            <div className="deltail-ads-modal-content">
                {/* Modal Header */}
                <div className="deltail-ads-modal-header">
                    <h2>Advertisement Details</h2>
                </div>

                {/* Modal Body */}
                <div className="deltail-ads-modal-body">
                    {/* Hàng đầu tiên */}
                    <div className="deltail-ads-form-row four-columns">
                        <div className="deltail-ads-form-group">
                            <label><FaEnvelope className="deltail-ads-icon" /> Email</label>
                            <input type="email" className="deltail-ads-input" value={adData.contactEmail} readOnly />
                        </div>
                        <div className="deltail-ads-form-group">
                            <label><FaPhone className="deltail-ads-icon" /> Phone</label>
                            <input type="text" className="deltail-ads-input" value={adData.contactPhone} readOnly />
                        </div>
                        <div className="deltail-ads-form-group">
                            <label><FaMapMarkerAlt className="deltail-ads-icon" /> Location</label>
                            <input type="text" className="deltail-ads-input" value={adData.location} readOnly />
                        </div>
                        <div className="deltail-ads-form-group">
                            <label><FaLink className="deltail-ads-icon" /> Link</label>
                            <input type="text" className="deltail-ads-input" value={adData.link} readOnly />
                        </div>
                    </div>

                    {/* Hàng thứ hai - Title, Start Date, End Date, Created At */}
                    <div className="deltail-ads-form-row four-columns">
                        <div className="deltail-ads-form-group">
                            <label><FaRegFileAlt className="deltail-ads-icon" /> Title</label>
                            <input type="text" className="deltail-ads-input" value={adData.title} readOnly />
                        </div>
                        <div className="deltail-ads-form-group date-width">
                            <label><FaCalendarAlt className="deltail-ads-icon" /> Start Date</label>
                            <input type="date" className="deltail-ads-input short-input" value={adData.startDate} readOnly />
                        </div>
                        <div className="deltail-ads-form-group date-width">
                            <label><FaCalendarAlt className="deltail-ads-icon" /> End Date</label>
                            <input type="date" className="deltail-ads-input short-input" value={adData.endDate} readOnly />
                        </div>
                        <div className="deltail-ads-form-group date-width">
                            <label><FaCalendarAlt className="deltail-ads-icon" /> Created At</label>
                            <input type="text" className="deltail-ads-input short-input" value={adData.createdAt} readOnly />
                        </div>
                    </div>

                    {/* Hàng thứ ba - Status */}
                    <div className="deltail-ads-form-row two-columns">
                        <div className="deltail-ads-form-group status-short">
                            <label><FaRegFileAlt className="deltail-ads-icon" /> Status</label>
                            <input type="text" className="deltail-ads-input" value={adData.status} readOnly />
                        </div>
                    </div>

                    {/* Hàng thứ tư - Description */}
                    <div className="deltail-ads-form-row">
                        <div className="deltail-ads-form-group full-width">
                            <label><FaRegFileAlt className="deltail-ads-icon" /> Description</label>
                            <textarea className="deltail-ads-input" rows="2" value={adData.description} readOnly></textarea>
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="deltail-ads-form-row image-row">
                        <div className="deltail-ads-form-group full-width">
                            <label><FaRegFileAlt className="deltail-ads-icon" /> Advertisement Image</label>
                            <div className="deltail-ads-image-container">
                                <img src={adData.image} alt="Advertisement" className="deltail-ads-image" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="deltail-ads-modal-footer">
                    <button className="deltail-ads-button">Close</button>
                    <button className="deltail-ads-button deltail-ads-button-primary">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default AdsDetail;
