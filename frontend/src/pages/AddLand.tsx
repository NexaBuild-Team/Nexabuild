import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { createLand, uploadLandImageApi } from '../services/landApi'

interface UploadingImage {
  id: string
  name: string
  status: 'uploading' | 'success' | 'error'
  url?: string
}

export default function AddLand() {
  const navigate = useNavigate()

  // Required Form Fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [perches, setPerches] = useState('')
  const [landType, setLandType] = useState('Residential')
  const [status, setStatus] = useState('For Sale')

  // Optional Form Fields
  const [sqft, setSqft] = useState('')
  const [purpose, setPurpose] = useState('')
  const [environment, setEnvironment] = useState('')
  const [developmentPlan, setDevelopmentPlan] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  // Images State
  const [images, setImages] = useState<string[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<UploadingImage[]>([])

  // UI feedback states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Handle Multi-file Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    for (const file of files) {
      const uploadId = `${file.name}-${Date.now()}`
      
      // Mark as uploading
      setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, status: 'uploading' }])

      try {
        const result = await uploadLandImageApi(file)
        
        // Update to success status
        setUploadingFiles(prev =>
          prev.map(img => img.id === uploadId ? { ...img, status: 'success', url: result.url } : img)
        )
        
        // Append URL to the main list
        setImages(prev => [...prev, result.url])
      } catch (err: any) {
        console.error('Image upload failed:', err)
        setUploadingFiles(prev =>
          prev.map(img => img.id === uploadId ? { ...img, status: 'error' } : img)
        )
      }
    }
  }

  // Remove uploaded image
  const handleRemoveImage = (url: string) => {
    setImages(prev => prev.filter(imgUrl => imgUrl !== url))
    setUploadingFiles(prev => prev.filter(img => img.url !== url))
  }

  // Form Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    // Validation of required fields
    if (!name.trim()) return setErrorMsg('Name is required.')
    if (!description.trim()) return setErrorMsg('Description is required.')
    if (!price || parseFloat(price) <= 0) return setErrorMsg('Price must be a positive number.')
    if (!location.trim()) return setErrorMsg('Location is required.')
    if (!perches || parseFloat(perches) <= 0) return setErrorMsg('Perches must be a positive number.')
    if (!landType) return setErrorMsg('Land Type is required.')
    if (!status) return setErrorMsg('Status is required.')

    setIsSubmitting(true)

    // Build Payload
    const payload = {
      name,
      description,
      price: parseFloat(price),
      location,
      perches: parseFloat(perches),
      sqft: sqft ? parseFloat(sqft) : null,
      landType,
      status,
      purpose: purpose.trim() || null,
      environment: environment.trim() || null,
      developmentPlan: developmentPlan.trim() || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      images,
    }

    try {
      await createLand(payload)
      setSuccessMsg('Land Listing published successfully! Redirecting...')
      setTimeout(() => {
        navigate('/land')
      }, 1500)
    } catch (err: any) {
      console.error('Failed to create land listing:', err)
      setErrorMsg(err?.response?.data?.message || 'Failed to publish land listing. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(90deg, #345b79 0%, #6b879c 100%)' }}>
          <h1 className="text-2xl font-bold tracking-tight">Publish New Land Listing</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(230,224,212,0.85)' }}>
            Enter listing attributes and upload photos to list a property on NexaBuild.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Error & Success Banners */}
          {errorMsg && (
            <div className="p-4 rounded-xl text-red-700 bg-red-50 border border-red-200 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-4 rounded-xl text-green-700 bg-green-50 border border-green-200 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Section 1: Basic Specs */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-1" style={{ color: '#928d64', borderColor: '#e6e0d4' }}>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Property Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Prime Residential Land, Colombo 5"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Price (LKR) *</label>
                <input
                  type="number"
                  placeholder="e.g. 28500000"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Description *</label>
                <textarea
                  placeholder="Detail features, road status, neighborhood, access to highway etc."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Perches *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 15"
                  value={perches}
                  onChange={e => setPerches(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Total Sqft (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 3600"
                  value={sqft}
                  onChange={e => setSqft(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Categorization & Location */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-1" style={{ color: '#928d64', borderColor: '#e6e0d4' }}>
              Type & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Location / City *</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo 5, Western Province"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Land Type *</label>
                <select
                  value={landType}
                  onChange={e => setLandType(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', backgroundColor: '#fff' }}
                  required
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Listing Status *</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', backgroundColor: '#fff' }}
                  required
                >
                  <option value="For Sale">For Sale</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Latitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 6.9271"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                    style={{ borderColor: '#e6e0d4' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Longitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 79.8612"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                    style={{ borderColor: '#e6e0d4' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Preferences */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-1" style={{ color: '#928d64', borderColor: '#e6e0d4' }}>
              AI Preferences (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Build Home, Commercial Hub"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Environment</label>
                <input
                  type="text"
                  placeholder="e.g. City / Urban Area, Waterfront"
                  value={environment}
                  onChange={e => setEnvironment(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1d] mb-1.5">Development Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Build / Develop Immediately"
                  value={developmentPlan}
                  onChange={e => setDevelopmentPlan(e.target.value)}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#345b79] transition-colors"
                  style={{ borderColor: '#e6e0d4' }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-1" style={{ color: '#928d64', borderColor: '#e6e0d4' }}>
              Image Gallery
            </h2>
            
            {/* File dropzone click trigger */}
            <div
              className="border-2 border-dashed rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center relative"
              style={{ borderColor: '#ccb7a3' }}
              onClick={() => document.getElementById('image-upload-input')?.click()}
            >
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-xs font-bold text-[#345b79]">Click here to upload property photos</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG (multiple uploads supported)</p>
            </div>

            {/* Upload list progress indicators & Thumbnail previews */}
            {uploadingFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                {uploadingFiles.map(img => (
                  <div key={img.id} className="relative rounded-xl border overflow-hidden bg-slate-50 group flex flex-col items-center justify-center h-28 p-2" style={{ borderColor: '#e6e0d4' }}>
                    {img.status === 'uploading' && (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg className="w-5 h-5 animate-spin text-[#345b79]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-[9px] font-semibold text-slate-400 truncate max-w-full">{img.name}</span>
                      </div>
                    )}
                    
                    {img.status === 'success' && img.url && (
                      <>
                        <img src={img.url} alt="property thumbnail" className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.url!)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}

                    {img.status === 'error' && (
                      <div className="flex flex-col items-center justify-center space-y-1 text-center">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <span className="text-[9px] font-bold text-red-500">Failed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t flex items-center justify-end gap-3" style={{ borderColor: '#e6e0d4' }}>
            <button
              type="button"
              onClick={() => navigate('/land')}
              className="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
              style={{ borderColor: '#345b79', color: '#345b79' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #be5d3f, #d59b86)' }}
            >
              {isSubmitting ? 'Publishing Listing...' : 'Publish Land Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
