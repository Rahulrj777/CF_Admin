import { useState, useEffect } from "react"
import axios from "axios"
import { API_BASE } from "../../Utils/Api.js"

// Set up an axios instance with interceptors to debug requests/responses
const api = axios.create({ baseURL: API_BASE })

// Debug every request
api.interceptors.request.use((config) => {
  console.log("[v0] Request:", {
    method: config.method,
    url: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
    headers: config.headers,
  })
  return config
})

// Debug every response
api.interceptors.response.use(
  (res) => {
    console.log("[v0] Response:", { status: res.status, url: res.config?.url, data: res.data })
    return res
  },
  (err) => {
    console.log("[v0] Response Error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
    })
    return Promise.reject(err)
  },
)

const HomeBanner = () => {
  const [banners, setBanners] = useState([])
  const [image, setImage] = useState(null)
  const [lastError, setLastError] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await api.get(`/homebanner`)
      setBanners(res.data)
    } catch (err) {
      console.error("[v0] Error fetching banners:", err)
      setLastError(
        `Fetch banners failed: ${err.response?.status} - ${JSON.stringify(err.response?.data) || err.message}`,
      )
    }
  }

  useEffect(() => {
    console.log("[v0] API_BASE:", API_BASE)
    fetchBanners()
  }, [])

  // Upload banner
  const handleUpload = async (e) => {
    e.preventDefault()
    setLastError(null)
    if (!image) {
      console.log("[v0] No image selected")
      return
    }

    console.log("[v0] Selected file:", {
      name: image.name,
      size: image.size,
      type: image.type,
      lastModified: image.lastModified,
    })

    const formData = new FormData()
    formData.append("image", image)

    try {
      setUploading(true)

      // IMPORTANT: don't set Content-Type manually; let axios set the boundary
      const res = await api.post(`/homebanner/upload`, formData)
      console.log("[v0] Upload response data:", res.data)

      setImage(null)
      await fetchBanners()
    } catch (err) {
      console.error("[v0] Error uploading banner:", err)
      setLastError(`Upload failed: ${err.response?.status} - ${JSON.stringify(err.response?.data) || err.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Delete banner
  const handleDelete = async (_id) => {
    try {
      console.log("[v0] Deleting banner:", _id)
      await api.delete(`/homebanner/${_id}`)
      await fetchBanners()
    } catch (err) {
      console.error("[v0] Error deleting banner:", err)
      setLastError(`Delete failed: ${err.response?.status} - ${JSON.stringify(err.response?.data) || err.message}`)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Home Banners</h2>

      {lastError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 text-red-700 p-3">
          <p className="font-medium">Error</p>
          <pre className="text-sm overflow-auto">{lastError}</pre>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            console.log("[v0] File input change:", file)
            setImage(file || null)
          }}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
          disabled={!image || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Banner List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="relative border rounded-lg overflow-hidden">
            <img src={banner.imageUrl || "/placeholder.svg"} alt="banner" className="w-full h-40 object-cover" />
            <button
              onClick={() => handleDelete(banner._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeBanner
