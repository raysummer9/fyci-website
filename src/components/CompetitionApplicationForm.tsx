'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Competition, CompetitionFormField } from '@/types'
import { CheckCircle, AlertCircle, Loader2, Upload } from 'lucide-react'

interface CompetitionApplicationFormProps {
  competition: Competition
}

export default function CompetitionApplicationForm({ competition }: CompetitionApplicationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  if (!competition.application_form?.enabled) {
    return null
  }

  const formConfig = competition.application_form

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [fieldId]: file }))
    } else {
      const newFiles = { ...files }
      delete newFiles[fieldId]
      setFiles(newFiles)
    }
  }

  const validateForm = (): boolean => {
    for (const field of formConfig.fields) {
      if (field.required) {
        if (field.type === 'file') {
          if (!files[field.id]) {
            setErrorMessage(`Please upload ${field.label}`)
            return false
          }
        } else {
          if (!formData[field.id] || formData[field.id].toString().trim() === '') {
            setErrorMessage(`Please fill in ${field.label}`)
            return false
          }
        }
      }

      // Email validation
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          setErrorMessage(`Please enter a valid email address for ${field.label}`)
          return false
        }
      }

      // Phone validation (basic)
      if (field.type === 'phone' && formData[field.id]) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        if (!phoneRegex.test(formData[field.id])) {
          setErrorMessage(`Please enter a valid phone number for ${field.label}`)
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage('')

    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload files first if any
      const fileUrls: Record<string, string> = {}
      for (const [fieldId, file] of Object.entries(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const uploadResponse = await fetch('/admin/api/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          fileUrls[fieldId] = result.url
        } else {
          throw new Error('Failed to upload file')
        }
      }

      // Prepare submission data
      const submissionData: Record<string, any> = {}
      for (const field of formConfig.fields) {
        if (field.type === 'file') {
          submissionData[field.id] = fileUrls[field.id] || ''
        } else {
          submissionData[field.id] = formData[field.id] || ''
        }
      }

      // Submit application
      const response = await fetch('/api/competitions/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: competition.id,
          applicant_name: formData.name || '',
          applicant_email: formData.email || '',
          applicant_phone: formData.phone || '',
          form_data: submissionData
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({})
        setFiles({})
      } else {
        setErrorMessage(result.error || 'Failed to submit application. Please try again.')
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: CompetitionFormField) => {
    const value = formData[field.id] || ''
    const file = files[field.id]

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full"
          />
        )

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              id={field.id}
              onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
              required={field.required}
              className="hidden"
            />
            <Label htmlFor={field.id}>
              <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                {file ? (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-700">{file.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFileChange(field.id, null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload file</p>
                  </div>
                )}
              </div>
            </Label>
          </div>
        )

      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Application Submitted!</h3>
            <p className="text-green-700 mt-1">
              {formConfig.successMessage || 'Thank you for your application! We will review it and get back to you soon.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for this Competition</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitStatus === 'error' && errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Default fields (name, email, phone) */}
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Custom form fields */}
        {formConfig.fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderField(field)}
          </div>
        ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            formConfig.submitButtonText || 'Submit Application'
          )}
        </Button>
      </form>
    </div>
  )
}

