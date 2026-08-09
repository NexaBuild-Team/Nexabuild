import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface ProjectDetail {
  id: string
  title: string
  description: string | null
  projectType: string | null
  location: string | null
  budget: number | null
  images: string[]
  completionDate: string | null
  status: string | null
  companyId: string
  company: {
    id: string
    name: string
  }
}

export default function ConstructionProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    api
      .get<ProjectDetail>(`/construction/projects/${id}`)
      .then((response) => setProject(response.data))
      .catch((err) => {
        console.error(err)
        setError('Unable to load project details. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#e6e0d4] p-6">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading project details...</p>
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#e6e0d4] p-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <p className="text-lg font-semibold text-[#1d1d1d]">{error ?? 'Project not found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-3 rounded-xl bg-[#345b79] text-white font-semibold"
          >
            Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#e6e0d4] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-3xl overflow-hidden shadow-xl" style={{ backgroundColor: '#fff' }}>
          <div className="relative h-80 overflow-hidden">
            <img
              src={project.images[0] ?? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(29,29,29,0.70), transparent 60%)' }} />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm uppercase tracking-widest">{project.status ?? 'Unknown status'}</p>
              <h1 className="text-4xl font-bold mt-2">{project.title}</h1>
              <p className="mt-2 text-sm max-w-2xl">{project.company.name} · {project.location ?? 'Location unavailable'}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#be5d3f]">Project Details</p>
                  <h2 className="text-3xl font-bold text-[#1d1d1d] mt-2">{project.title}</h2>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-xl bg-[#345b79] px-5 py-3 text-sm font-semibold text-white"
                >
                  Back to Company
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#928d64]">Type</p>
                  <p className="mt-2 text-sm font-semibold text-[#1d1d1d]">{project.projectType ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#928d64]">Budget</p>
                  <p className="mt-2 text-sm font-semibold text-[#1d1d1d]">{project.budget ? `LKR ${project.budget.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#928d64]">Completion date</p>
                  <p className="mt-2 text-sm font-semibold text-[#1d1d1d]">{project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'TBD'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#928d64]">Location</p>
                  <p className="mt-2 text-sm font-semibold text-[#1d1d1d]">{project.location ?? 'N/A'}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-base leading-relaxed text-[#6b879c]">{project.description || 'No description available for this project yet.'}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[#1d1d1d] mb-4">Project Images</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.length > 0 ? (
                  project.images.map((img, idx) => (
                    <div key={idx} className="overflow-hidden rounded-3xl h-60 bg-[#f7f4f0]">
                      <img src={img} alt={`${project.title} photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-[#f7f4f0] p-10 text-center text-sm text-[#928d64]">
                    No images available.
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[#1d1d1d] mb-4">Company</h3>
              <p className="text-sm font-semibold text-[#1d1d1d] mb-2">{project.company.name}</p>
              <p className="text-sm leading-relaxed text-[#6b879c]">View all projects and overview for the company that delivered this work.</p>
              <button
                onClick={() => navigate(`/construction-companies/${project.company.id}`)}
                className="mt-6 w-full rounded-xl bg-[#be5d3f] px-5 py-3 text-sm font-semibold text-white"
              >
                View Company Profile
              </button>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[#1d1d1d] mb-4">Status</h3>
              <p className="text-sm font-semibold text-[#1d1d1d]">{project.status ?? 'Unknown'}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#6b879c]">The project status is shown based on the stored construction timeline.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
