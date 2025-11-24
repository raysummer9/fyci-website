'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CompetitionApplicationForm, CompetitionFormField } from '@/types'
import { Plus, Trash2, GripVertical, MoveUp, MoveDown } from 'lucide-react'

interface CompetitionFormBuilderProps {
  formConfig: CompetitionApplicationForm | null | undefined
  onChange: (formConfig: CompetitionApplicationForm) => void
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'number', label: 'Number' },
  { value: 'file', label: 'File Upload' },
  { value: 'checkbox', label: 'Checkbox' },
]

export default function CompetitionFormBuilder({ formConfig, onChange }: CompetitionFormBuilderProps) {
  const [form, setForm] = useState<CompetitionApplicationForm>(
    formConfig || {
      enabled: false,
      fields: [],
      submitButtonText: 'Submit Application',
      successMessage: 'Thank you for your application! We will review it and get back to you soon.'
    }
  )

  const updateForm = (updates: Partial<CompetitionApplicationForm>) => {
    const newForm = { ...form, ...updates }
    setForm(newForm)
    onChange(newForm)
  }

  const addField = () => {
    const newField: CompetitionFormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: ''
    }
    updateForm({
      fields: [...form.fields, newField]
    })
  }

  const removeField = (fieldId: string) => {
    updateForm({
      fields: form.fields.filter(f => f.id !== fieldId)
    })
  }

  const updateField = (fieldId: string, updates: Partial<CompetitionFormField>) => {
    updateForm({
      fields: form.fields.map(f =>
        f.id === fieldId ? { ...f, ...updates } : f
      )
    })
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...form.fields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newFields.length) return
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
    updateForm({ fields: newFields })
  }

  const addOption = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId)
    if (field && field.type === 'select') {
      const newOptions = [...(field.options || []), 'New Option']
      updateField(fieldId, { options: newOptions })
    }
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = form.fields.find(f => f.id === fieldId)
    if (field && field.type === 'select' && field.options) {
      const newOptions = [...field.options]
      newOptions[optionIndex] = value
      updateField(fieldId, { options: newOptions })
    }
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = form.fields.find(f => f.id === fieldId)
    if (field && field.type === 'select' && field.options) {
      const newOptions = field.options.filter((_, i) => i !== optionIndex)
      updateField(fieldId, { options: newOptions })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Application Form</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="form-enabled"
              checked={form.enabled}
              onCheckedChange={(checked) => updateForm({ enabled: checked })}
            />
            <Label htmlFor="form-enabled" className="cursor-pointer">
              {form.enabled ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {form.enabled && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="submit-button-text">Submit Button Text</Label>
                <Input
                  id="submit-button-text"
                  value={form.submitButtonText || 'Submit Application'}
                  onChange={(e) => updateForm({ submitButtonText: e.target.value })}
                  placeholder="Submit Application"
                />
              </div>
              <div>
                <Label htmlFor="success-message">Success Message</Label>
                <Input
                  id="success-message"
                  value={form.successMessage || ''}
                  onChange={(e) => updateForm({ successMessage: e.target.value })}
                  placeholder="Thank you for your application!"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Form Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {form.fields.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  <p>No fields added yet. Click "Add Field" to get started.</p>
                </div>
              )}

              {form.fields.map((field, index) => (
                <Card key={field.id} className="border-2">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Field Label *</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                placeholder="Field Label"
                                required
                              />
                            </div>
                            <div>
                              <Label>Field Type *</Label>
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const newType = e.target.value as CompetitionFormField['type']
                                  const updates: Partial<CompetitionFormField> = { type: newType }
                                  if (newType === 'select' && !field.options) {
                                    updates.options = []
                                  }
                                  if (newType !== 'select') {
                                    updates.options = undefined
                                  }
                                  updateField(field.id, updates)
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {FIELD_TYPES.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {field.type !== 'select' && field.type !== 'checkbox' && (
                            <div>
                              <Label>Placeholder</Label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                placeholder="Enter placeholder text"
                              />
                            </div>
                          )}

                          {field.type === 'checkbox' && (
                            <div>
                              <Label>Checkbox Text (shown next to checkbox)</Label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                placeholder="Enter text to display next to checkbox"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                This text will be displayed next to the checkbox. The field label will be used as the question.
                              </p>
                            </div>
                          )}

                          {field.type === 'select' && (
                            <div className="space-y-2">
                              <Label>Options *</Label>
                              {field.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optIndex, e.target.value)}
                                    placeholder="Option value"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeOption(field.id, optIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(field.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label htmlFor={`required-${field.id}`} className="cursor-pointer">
                              Required field
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveField(index, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveField(index, 'down')}
                            disabled={index === form.fields.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {!form.enabled && (
          <div className="text-center py-8 text-gray-500">
            <p>Enable the form to start adding fields for collecting application data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

