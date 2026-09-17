import { useState } from 'react'
import Story from '../../components/story/Story'
import { FloatLabel } from '@react-registry/float-label'
import { Input } from '@react-registry/input'
import { Textarea } from '@react-registry/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Button } from '@react-registry/button'

export default function FloatLabelDemo() {
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [preselectedValue, setPreselectedValue] = useState('John Doe')
  const [messageValue, setMessageValue] = useState('')
  const [firstNameValue, setFirstNameValue] = useState('')
  const [lastNameValue, setLastNameValue] = useState('')
  const [profileName, setProfileName] = useState('Jane Smith')
  const [profileEmail, setProfileEmail] = useState('jane.smith@example.com')
  const [profileBio, setProfileBio] = useState('Product designer passionate about design systems.')

  return (
    <>
      <Story
        title="Basic input"
        description="Label floats up on focus or when a value is present. Use a single-space placeholder to keep the label centered."
      >
        <div className="max-w-md space-y-2">
          <FloatLabel label="Full Name" className="w-full">
            <Input value={nameValue} onChange={(e) => setNameValue(e.target.value)} placeholder=" " className="h-11" />
          </FloatLabel>
          <p className="text-muted-foreground text-xs">Value: {nameValue || 'empty'}</p>
        </div>
      </Story>

      <Story
        title="Pre-filled & required"
        description="Label stays floated when the input has a value. Required fields show a red asterisk."
      >
        <div className="max-w-md space-y-4">
          <FloatLabel label="Full Name" className="w-full">
            <Input
              value={preselectedValue}
              onChange={(e) => setPreselectedValue(e.target.value)}
              placeholder=" "
              className="h-11"
            />
          </FloatLabel>
          <FloatLabel label="Email" required className="w-full">
            <Input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder=" "
              className="h-11"
            />
          </FloatLabel>
        </div>
      </Story>

      <Story
        title="Input types"
        description="Floating labels work across email, number, password, and textarea inputs."
      >
        <div className="max-w-md space-y-4">
          <FloatLabel label="Email Address" required className="w-full">
            <Input type="email" placeholder=" " className="h-11" />
          </FloatLabel>
          <FloatLabel label="Age" className="w-full">
            <Input type="number" placeholder=" " className="h-11" />
          </FloatLabel>
          <FloatLabel label="Password" required className="w-full">
            <Input type="password" placeholder=" " className="h-11" />
          </FloatLabel>
          <FloatLabel label="Message" className="w-full">
            <Textarea value={messageValue} onValueChange={setMessageValue} placeholder=" " className="min-h-24" />
          </FloatLabel>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="The wrapper and input are both disabled — label stays floated, interaction is blocked."
      >
        <div className="max-w-md">
          <FloatLabel label="Username" disabled className="w-full">
            <Input disabled placeholder=" " className="h-11" />
          </FloatLabel>
        </div>
      </Story>

      <Story
        title="Side by side"
        description="Two float-label inputs in a row — common in name fields and date ranges."
      >
        <div className="flex max-w-md gap-4">
          <FloatLabel label="First Name" className="flex-1">
            <Input
              value={firstNameValue}
              onChange={(e) => setFirstNameValue(e.target.value)}
              placeholder=" "
              className="h-11"
            />
          </FloatLabel>
          <FloatLabel label="Last Name" className="flex-1">
            <Input
              value={lastNameValue}
              onChange={(e) => setLastNameValue(e.target.value)}
              placeholder=" "
              className="h-11"
            />
          </FloatLabel>
        </div>
      </Story>

      <Story
        title="In context: Profile form"
        description="A realistic edit-profile card with multiple float-label fields and a save button."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>Update your personal information below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <FloatLabel label="First Name" className="flex-1">
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder=" "
                  className="h-11"
                />
              </FloatLabel>
              <FloatLabel label="Last Name" className="flex-1">
                <Input placeholder=" " className="h-11" />
              </FloatLabel>
            </div>
            <FloatLabel label="Email" required className="w-full">
              <Input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder=" "
                className="h-11"
              />
            </FloatLabel>
            <FloatLabel label="Bio" className="w-full">
              <Textarea value={profileBio} onValueChange={setProfileBio} placeholder=" " className="min-h-20" />
            </FloatLabel>
            <Button className="w-full">Save changes</Button>
          </CardContent>
        </Card>
      </Story>
    </>
  )
}
