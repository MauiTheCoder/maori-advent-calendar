import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rā Katoa</h1>
                <p className="text-sm text-muted-foreground">Cultural Journey</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Te Wānanga o Aotearoa
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="cultural-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
              <CardDescription>
                There was a problem with your authentication request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Authentication failed. Please try signing in again.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  This could be due to an expired link, invalid credentials, or a temporary issue.
                </p>

                <div className="flex flex-col space-y-3">
                  <Link href="/">
                    <Button className="w-full">
                      Return to Home
                    </Button>
                  </Link>

                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">
                      Try Signing In Again
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  If you continue to experience issues, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
