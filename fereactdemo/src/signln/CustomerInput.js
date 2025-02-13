import React from 'react'
const CustomerInput = ({ type, label, i_id, i_class, value, onChange }) => {
    return (
        <div className="form-floating mb-3">
            <input
                type={type}
                className={`form-control ${i_class}`}
                id={i_id}
                placeholder={label}
                value={value}
                onChange={onChange}
            />
            <label htmlFor={i_id}>{label}</label>
        </div>
    )
}
export default CustomerInput