'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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

  // Check if custom fields include name, email, or phone
  const hasNameField = formConfig.fields.some(f => 
    f.id.toLowerCase().includes('name') || 
    f.label.toLowerCase().includes('name') ||
    f.label.toLowerCase().includes('full name')
  )
  const hasEmailField = formConfig.fields.some(f => 
    f.id.toLowerCase().includes('email') || 
    f.label.toLowerCase().includes('email')
  )
  const hasPhoneField = formConfig.fields.some(f => 
    f.id.toLowerCase().includes('phone') || 
    f.label.toLowerCase().includes('phone')
  )

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
    // Validate default fields if they're not in custom fields
    if (!hasNameField) {
      if (!formData.name?.trim()) {
        setErrorMessage('Please fill in your full name')
        return false
      }
    }
    if (!hasEmailField) {
      if (!formData.email?.trim()) {
        setErrorMessage('Please fill in your email address')
        return false
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrorMessage('Please enter a valid email address')
        return false
      }
    }

    // Validate custom fields
    for (const field of formConfig.fields) {
      if (field.required) {
        if (field.type === 'file') {
          if (!files[field.id]) {
            setErrorMessage(`Please upload ${field.label}`)
            return false
          }
        } else if (field.type === 'checkbox') {
          if (!formData[field.id]) {
            setErrorMessage(`Please check ${field.label}`)
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
        } else if (field.type === 'checkbox') {
          submissionData[field.id] = formData[field.id] || false
        } else {
          submissionData[field.id] = formData[field.id] || ''
        }
      }

      // Get name, email, phone from either default fields or custom fields
      let applicantName = formData.name || ''
      let applicantEmail = formData.email || ''
      let applicantPhone = formData.phone || ''

      if (hasNameField) {
        const nameField = formConfig.fields.find(f => 
          f.id.toLowerCase().includes('name') || 
          f.label.toLowerCase().includes('name') ||
          f.label.toLowerCase().includes('full name')
        )
        if (nameField) {
          applicantName = submissionData[nameField.id] || ''
        }
      }

      if (hasEmailField) {
        const emailField = formConfig.fields.find(f => 
          f.id.toLowerCase().includes('email') || 
          f.label.toLowerCase().includes('email')
        )
        if (emailField) {
          applicantEmail = submissionData[emailField.id] || ''
        }
      }

      if (hasPhoneField) {
        const phoneField = formConfig.fields.find(f => 
          f.id.toLowerCase().includes('phone') || 
          f.label.toLowerCase().includes('phone')
        )
        if (phoneField) {
          applicantPhone = submissionData[phoneField.id] || ''
        }
      }

      // Submit application
      const response = await fetch('/api/competitions/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: competition.id,
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          applicant_phone: applicantPhone,
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        )

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
            <Label htmlFor={field.id} className="cursor-pointer">
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                {file ? (
                  <div className="space-y-3">
                    <Upload className="h-8 w-8 mx-auto text-blue-600" />
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFileChange(field.id, null)
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload file</p>
                    <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX, Images</p>
                  </div>
                )}
              </div>
            </Label>
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              required={field.required}
              className="mt-1"
            />
            <Label 
              htmlFor={field.id} 
              className="text-sm leading-relaxed cursor-pointer flex-1"
            >
              {field.placeholder || field.label}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        )
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Application Submitted!</h3>
            <p className="text-green-700 mt-2 leading-relaxed">
              {formConfig.successMessage || 'Thank you for your application! We will review it and get back to you soon.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Apply for this Competition</h3>
        <p className="text-gray-600 text-sm sm:text-base">Fill out the form below to submit your application.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {submitStatus === 'error' && errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm sm:text-base">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Default fields (only show if not in custom fields) */}
        {!hasNameField && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {!hasEmailField && (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {!hasPhoneField && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {/* Custom form fields - display in creation order */}
        {formConfig.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            {field.type !== 'checkbox' && (
              <Label htmlFor={field.id} className="text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            {renderField(field)}
          </div>
        ))}

        {/* Required field indicator */}
        <div className="pt-2">
          <p className="text-sm text-gray-500">
            <span className="text-red-500">*</span> indicates required
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
