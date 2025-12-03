'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CompetitionApplication } from '@/types'
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react'

interface ApplicationWithCompetition extends CompetitionApplication {
  competition?: {
    id: string
    title: string
    slug: string
    application_form?: {
      enabled: boolean
      fields: Array<{
        id: string
        label: string
        type: string
      }>
    }
  }
}

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<ApplicationWithCompetition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [competitionFilter, setCompetitionFilter] = useState<string>('all')
  const [competitions, setCompetitions] = useState<Array<{ id: string; title: string; slug: string }>>([])
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithCompetition | null>(null)
  const [notes, setNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadApplications()
    loadCompetitions()
  }, [])

  const loadCompetitions = async () => {
    try {
      const response = await fetch('/admin/api/competitions')
      if (response.ok) {
        const data = await response.json()
        setCompetitions(data)
      }
    } catch (error) {
      console.error('Error loading competitions:', error)
    }
  }

  const loadApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all applications directly from admin API
      const response = await fetch('/admin/api/applications')
      const responseData = await response.json().catch(() => ({ error: 'Failed to parse response' }))
      
      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        })
        throw new Error(responseData.error || responseData.details || `Failed to fetch applications (${response.status})`)
      }
      
      console.log('Applications loaded:', responseData.length || 0)
      setApplications(Array.isArray(responseData) ? responseData : [])
    } catch (error) {
      console.error('Error loading applications:', error)
      setError(error instanceof Error ? error.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const application = applications.find(app => app.id === applicationId)
      if (!application || !application.competition?.slug) return

      const response = await fetch(`/api/competitions/${application.competition.slug}/applications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          status: newStatus,
          notes: notes || application.notes || ''
        })
      })

      if (response.ok) {
        await loadApplications()
        // Keep the application expanded but refresh the data
        const updatedApp = await response.json()
        setSelectedApplication(updatedApp)
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      setError('Failed to update application')
    } finally {
      setUpdating(false)
    }
  }

  const handleNotesUpdate = async (applicationId: string) => {
    setUpdating(true)
    try {
      const application = applications.find(app => app.id === applicationId)
      if (!application || !application.competition?.slug) return

      const response = await fetch(`/api/competitions/${application.competition.slug}/applications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          notes: notes
        })
      })

      if (response.ok) {
        await loadApplications()
        const updatedApp = await response.json()
        setSelectedApplication(updatedApp)
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to update notes')
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      setError('Failed to update notes')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any, color: string }> = {
      pending: { variant: 'outline', icon: Clock, color: 'text-yellow-600' },
      reviewed: { variant: 'secondary', icon: Eye, color: 'text-blue-600' },
      accepted: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.competition?.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesCompetition = competitionFilter === 'all' || app.competition_id === competitionFilter

    return matchesSearch && matchesStatus && matchesCompetition
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading applications...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or competition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="competition-filter">Competition</Label>
              <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                <SelectTrigger id="competition-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitions</SelectItem>
                  {competitions.map(comp => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{application.applicant_name}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> {application.applicant_email}</p>
                        {application.applicant_phone && (
                          <p><strong>Phone:</strong> {application.applicant_phone}</p>
                        )}
                        <p><strong>Competition:</strong> {application.competition?.title || 'Unknown'}</p>
                        <p><strong>Submitted:</strong> {formatDate(application.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (expandedApplication === application.id) {
                            setExpandedApplication(null)
                            setSelectedApplication(null)
                            setNotes('')
                          } else {
                            setExpandedApplication(application.id)
                            setSelectedApplication(application)
                            setNotes(application.notes || '')
                          }
                        }}
                      >
                        {expandedApplication === application.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedApplication === application.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Form Data */}
                      <div>
                        <h4 className="font-semibold mb-2">Application Details</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          {Object.entries(application.form_data || {}).map(([key, value]) => {
                            // Find the field label from the competition's form config
                            const fieldConfig = application.competition?.application_form?.fields?.find(
                              f => f.id === key
                            )
                            const fieldLabel = fieldConfig?.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            
                            return (
                              <div key={key} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                <span className="font-medium w-full sm:w-1/3 text-gray-700">
                                  {fieldLabel}:
                                </span>
                                <span className="flex-1 text-gray-900">
                                  {typeof value === 'string' && value.startsWith('http') ? (
                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                      View File
                                    </a>
                                  ) : typeof value === 'boolean' ? (
                                    value ? 'Yes' : 'No'
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotesUpdate(application.id)}
                            disabled={updating}
                          >
                            Save Notes
                          </Button>
                        </div>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes about this application..."
                          rows={3}
                        />
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label>Update Status</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant={application.status === 'pending' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'pending')}
                              disabled={updating}
                            >
                              Pending
                            </Button>
                            <Button
                              variant={application.status === 'reviewed' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                              disabled={updating}
                            >
                              Reviewed
                            </Button>
                            <Button
                              variant={application.status === 'accepted' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              disabled={updating}
                            >
                              Accept
                            </Button>
                            <Button
                              variant={application.status === 'rejected' ? 'destructive' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              disabled={updating}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

