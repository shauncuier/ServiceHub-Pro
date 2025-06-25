import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../Auth/AuthContext";
import { api } from "../utils/api";
import usePageTitle from "../hooks/usePageTitle";
import { Plus, Image, MapPin, DollarSign, User, Mail, FileText, Tag } from "lucide-react";
import Swal from "sweetalert2";

const AddService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  usePageTitle(isEditing ? "Edit Service" : "Add Service");

  const [loading, setLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(isEditing);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    servicePrice: "",
    serviceArea: "",
    serviceImage: "",
    providerName: user?.displayName || "",
    providerEmail: user?.email || "",
    providerImage: user?.photoURL || "",
  });

  // Load service data for editing
  useEffect(() => {
    if (isEditing && editId) {
      const loadServiceForEdit = async () => {
        try {
          setLoadingService(true);
          const service = await api.services.getById(editId);
          setFormData({
            serviceName: service.serviceName || "",
            serviceDescription: service.serviceDescription || "",
            servicePrice: service.servicePrice || "",
            serviceArea: service.serviceArea || "",
            serviceImage: service.serviceImage || "",
            providerName: service.providerName || user?.displayName || "",
            providerEmail: service.providerEmail || user?.email || "",
            providerImage: service.providerImage || user?.photoURL || "",
          });
        } catch {
          Swal.fire({
            icon: "error",
            title: "Error Loading Service",
            text: "Unable to load service data for editing.",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            navigate("/manage-services");
          });
        } finally {
          setLoadingService(false);
        }
      };

      loadServiceForEdit();
    }
  }, [isEditing, editId, user, navigate]);

  // Bangladesh divisions for service area
  const divisions = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare data for API
      const serviceData = {
        ...formData,
        servicePrice: parseFloat(formData.servicePrice),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        await api.services.update(editId, serviceData);
        Swal.fire({
          icon: "success",
          title: "Service Updated Successfully! 🎉",
          text: "Your service has been updated and is now live.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/manage-services");
        });
      } else {
        serviceData.createdAt = new Date().toISOString();
        await api.services.create(serviceData);
        Swal.fire({
          icon: "success",
          title: "Service Added Successfully! 🚀",
          text: "Your service is now live and customers can book it.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/manage-services");
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops! Something went wrong",
        text: "There was an error saving your service. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingService) {
    return (
      <div className="min-h-screen bg-base-100 pt-20">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content">Loading service data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            {isEditing ? "Edit Service" : "Add Service"}
          </h1>
          <p className="text-base-content/70">
            {isEditing ? "Update your service" : "Create a new service"}
          </p>
        </div>

        {/* Simple Form */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Service Name</span>
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="e.g., Laptop Repair"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  placeholder="Describe your service..."
                  className="textarea textarea-bordered w-full h-24"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Price (৳)</span>
                  </label>
                  <input
                    type="number"
                    name="servicePrice"
                    value={formData.servicePrice}
                    onChange={handleChange}
                    placeholder="1000"
                    className="input input-bordered w-full"
                    min="100"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Area</span>
                  </label>
                  <select
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select area</option>
                    {divisions.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Service Image URL</span>
                </label>
                <input
                  type="url"
                  name="serviceImage"
                  value={formData.serviceImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Provider Name</span>
                </label>
                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Provider Email</span>
                </label>
                <input
                  type="email"
                  name="providerEmail"
                  value={formData.providerEmail}
                  className="input input-bordered w-full bg-base-200"
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Provider Image URL (Optional)</span>
                </label>
                <input
                  type="url"
                  name="providerImage"
                  value={formData.providerImage}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="input input-bordered w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-6"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  isEditing ? "Update Service" : "Add Service"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
