import { useState } from 'react'
import Story from '../../components/story/Story'
import { PasswordInput } from '@react-registry/password-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Button } from '@react-registry/button'

export default function PasswordInputDemo() {
  const [signupValue, setSignupValue] = useState('')
  const [loginValue, setLoginValue] = useState('')
  const [smValue, setSmValue] = useState('')
  const [lgValue, setLgValue] = useState('')
  const [filledValue, setFilledValue] = useState('')
  const [borderlessValue, setBorderlessValue] = useState('')
  const [readonlyValue, setReadonlyValue] = useState('s3cr3t-k3y')

  return (
    <>
      <Story
        title="Sign-up with strength meter"
        description="Live strength bar turns from red to green as the password meets more criteria."
      >
        <div className="max-w-md space-y-2">
          <PasswordInput
            value={signupValue}
            onChange={(e) => setSignupValue(e.target.value)}
            showStrength
            minLength={8}
            placeholder="Create a password..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            {signupValue ? `${signupValue.length} characters entered` : 'Start typing to see strength feedback'}
          </p>
        </div>
      </Story>

      <Story
        title="Size variants"
        description="Small for dense toolbars, default for forms, large for touch-first layouts."
      >
        <div className="max-w-md space-y-3">
          <PasswordInput
            value={smValue}
            onChange={(e) => setSmValue(e.target.value)}
            size="sm"
            placeholder="Small..."
            className="w-full"
          />
          <PasswordInput placeholder="Default..." className="w-full" />
          <PasswordInput
            value={lgValue}
            onChange={(e) => setLgValue(e.target.value)}
            size="lg"
            placeholder="Large..."
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="Variant styles"
        description="Outlined (default), filled for subtle surfaces, and borderless for inline editing."
      >
        <div className="max-w-md space-y-3">
          <PasswordInput placeholder="Outlined" className="w-full" />
          <PasswordInput
            value={filledValue}
            onChange={(e) => setFilledValue(e.target.value)}
            variant="filled"
            placeholder="Filled"
            className="w-full"
          />
          <PasswordInput
            value={borderlessValue}
            onChange={(e) => setBorderlessValue(e.target.value)}
            variant="borderless"
            placeholder="Borderless"
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="States"
        description="Read-only with a pre-filled API key, and a disabled input that blocks interaction."
      >
        <div className="max-w-md space-y-3">
          <PasswordInput
            value={readonlyValue}
            onChange={(e) => setReadonlyValue(e.target.value)}
            readOnly
            placeholder="Read-only"
            className="w-full"
          />
          <PasswordInput disabled placeholder="Disabled" className="w-full" />
        </div>
      </Story>

      <Story
        title="Without toggle"
        description="Hide the eye button for fields where revealing is not allowed, e.g. compliance-controlled inputs."
      >
        <div className="max-w-md">
          <PasswordInput showToggle={false} placeholder="Enter password..." className="w-full" />
        </div>
      </Story>

      <Story
        title="In context: Login card"
        description="A realistic sign-in form with email and password fields inside a card."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="border-input focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <PasswordInput
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
            <Button className="w-full">Sign in</Button>
            <p className="text-muted-foreground text-center text-xs">
              {loginValue ? `Password length: ${loginValue.length}` : 'No password entered'}
            </p>
          </CardContent>
        </Card>
      </Story>
    </>
  )
}
