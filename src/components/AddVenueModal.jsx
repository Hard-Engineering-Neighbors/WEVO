import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  MapPin,
  Users,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { createVenue } from "../api/venues";
import {
  uploadVenueImage,
  validateImageFile,
  formatFileSize,
} from "../utils/imageUpload";

export default function AddVenueModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    participants: "",
    image: "",
    department: "",
    location: "",
    features: [],
    status: "active",
  });
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUpload, setImageUpload] = useState({
    isUploading: false,
    preview: null,
    file: null,
    error: null,
  });

  const fileInputRef = useRef(null);

  const availableFeatures = [
    "Air Conditioning",
    "Audio System",
    "Projector",
    "WiFi",
    "Parking",
    "Kitchen",
    "Stage",
    "Microphone",
    "Lighting System",
    "Security",
    "Video Conferencing",
    "Sports Equipment",
    "Outdoor Setting",
    "Landscaping",
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      participants: "",
      image: "",
      department: "",
      location: "",
      features: [],
      status: "active",
    });
    setErrors({});
    setNewFeature("");
    setImageUpload({
      isUploading: false,
      preview: null,
      file: null,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the file
    const validationErrors = validateImageFile(file);
    if (validationErrors.length > 0) {
      setImageUpload((prev) => ({
        ...prev,
        error: validationErrors[0],
        file: null,
        preview: null,
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUpload((prev) => ({
        ...prev,
        preview: event.target.result,
        file: file,
        error: null,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!imageUpload.file) return;

    setImageUpload((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      const uploadResult = await uploadVenueImage(imageUpload.file);

      // Update form data with the uploaded image URL
      setFormData((prev) => ({
        ...prev,
        image: uploadResult.venueImagePath,
      }));

      // Update upload state
      setImageUpload((prev) => ({
        ...prev,
        isUploading: false,
        preview: uploadResult.venueImagePath,
      }));
    } catch (error) {
      setImageUpload((prev) => ({
        ...prev,
        isUploading: false,
        error: error.message,
      }));
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageUpload({
      isUploading: false,
      preview: null,
      file: null,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddFeature = (feature) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Venue name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.participants || formData.participants <= 0) {
      newErrors.participants = "Valid participant capacity is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Managing department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the venue object that matches venues.js structure
      const newVenueData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        participants: parseInt(formData.participants),
        image: formData.image || "/images/placeholder_venue.png",
        department: formData.department.trim(),
        location: formData.location.trim() || "TBD",
        features: formData.features,
        status: formData.status,
      };

      // Use the API to create the venue
      const createdVenue = await createVenue(newVenueData);

      // Call the onSave callback with the created venue
      if (onSave) {
        await onSave(createdVenue);
      }

      // Reset form and close modal
      resetForm();
      onClose();

      // Show success message
      alert(`Venue "${createdVenue.name}" has been added successfully!`);
    } catch (error) {
      console.error("Error adding venue:", error);
      alert("Failed to add venue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || imageUpload.isUploading) return; // Prevent closing while submitting
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[1100]">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#56708A]">Add New Venue</h2>
          <button
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            onClick={handleClose}
            disabled={isSubmitting || imageUpload.isUploading}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter venue name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Participants) *
              </label>
              <input
                type="number"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                disabled={isSubmitting}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.participants ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Maximum capacity"
              />
              {errors.participants && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.participants}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the venue, its features, and intended use..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Department and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Managing Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Student Affairs Office"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Building and floor/room number"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Image
            </label>

            {/* URL Input */}
            <div className="space-y-3">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com/image.jpg (or upload below)"
              />

              <div className="text-center text-gray-500 text-sm">OR</div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imageUpload.preview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imageUpload.preview}
                        alt="Venue preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        disabled={isSubmitting || imageUpload.isUploading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {imageUpload.file && !formData.image && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          {imageUpload.file.name} (
                          {formatFileSize(imageUpload.file.size)})
                        </p>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={isSubmitting || imageUpload.isUploading}
                          className="px-4 py-2 bg-[#56708A] text-white rounded-lg hover:bg-[#455b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                          {imageUpload.isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              Upload Image
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                    <ImageIcon
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600 mb-2">
                      Drop an image here or click to browse
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select Image
                    </button>
                  </div>
                )}

                {imageUpload.error && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {imageUpload.error}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP. Maximum size: 5MB.
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {availableFeatures.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleAddFeature(feature)}
                  disabled={formData.features.includes(feature) || isSubmitting}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.features.includes(feature)
                      ? "bg-[#56708A] text-white border-[#56708A]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>

            {/* Custom Feature Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                disabled={isSubmitting}
                placeholder="Add custom feature"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature(newFeature);
                    setNewFeature("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  handleAddFeature(newFeature);
                  setNewFeature("");
                }}
                disabled={!newFeature.trim() || isSubmitting}
                className="px-4 py-2 bg-[#56708A] text-white rounded-lg hover:bg-[#455b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Selected Features */}
            {formData.features.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected features:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#56708A] text-white text-xs rounded-full"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        disabled={isSubmitting}
                        className="hover:bg-white/20 rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56708A] focus:border-[#56708A] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="active">Active</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || imageUpload.isUploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || imageUpload.isUploading}
              className="flex-1 px-4 py-2 bg-[#56708A] text-white rounded-lg hover:bg-[#455b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                "Add Venue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
