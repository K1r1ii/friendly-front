import React from "react";

export default function EditProfileForm({ formData, error, success, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      {["first_name", "last_name", "nickname"].map((field) => (
        <div className="mb-3" key={field}>
          <label className="form-label">
            {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
          <input
            className="form-control profile-input"
            name={field}
            value={formData[field]}
            onChange={onChange}
            placeholder={`Input ${field.replace("_", " ")}`}
          />
        </div>
      ))}

      <div className="mb-3">
        <label className="form-label">Sex</label>
        <div className="custom-radio-group">
          <label className="custom-radio">
            <input
              type="radio"
              name="sex"
              value="Male"
              checked={formData.sex === "Male"}
              onChange={onChange}
            />
            <span className="radio-check"></span>
            Male
          </label>
          <label className="custom-radio">
            <input
              type="radio"
              name="sex"
              value="Female"
              checked={formData.sex === "Female"}
              onChange={onChange}
            />
            <span className="radio-check"></span>
            Female
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Birthday</label>
        <input
          type="date"
          className="form-control profile-input"
          name="birthday"
          value={formData.birthday}
          onChange={onChange}
        />
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <strong>Error!</strong> {error}
        </div>
      )}

      {success && (<div className="alert alert-success mb-4" role="alert">{success}</div>)}

      <div className="d-grid gap-2 d-md-flex justify-content-center">
        <button className="btn profile-save-button" type="submit">
          Save
        </button>
        <button className="btn btn-danger" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
