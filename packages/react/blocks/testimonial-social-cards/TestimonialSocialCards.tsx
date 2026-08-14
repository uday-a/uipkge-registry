'use client'

import { Heart, MessageCircle, Repeat2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Written as posts, not polished quotes — the lowercase, the caveats, and the
// specific numbers are what make them read as real.
const posts = [
  {
    name: 'Erin Walsh',
    handle: '@erinwalsh',
    initials: 'EW',
    when: '4h',
    body: 'closed the month in four days. four. i have been doing this for eleven years and that number has never started with a four.',
    replies: 18,
    reposts: 42,
    likes: 310,
  },
  {
    name: 'Marcus Ellery',
    handle: '@mellery',
    initials: 'ME',
    when: '1d',
    body: 'the thing that sold me was the diff. every metric change opens a PR. i can finally review what finance is about to publish instead of finding out in the board deck.',
    replies: 7,
    reposts: 91,
    likes: 604,
  },
  {
    name: 'Anna Reyes',
    handle: '@annareyes',
    initials: 'AR',
    when: '2d',
    body: 'migration took longer than the marketing site says (three weeks, not one) but nothing broke and we did not copy a single row out of the warehouse.',
    replies: 24,
    reposts: 33,
    likes: 188,
  },
  {
    name: 'Tom Fairbanks',
    handle: '@tfairbanks',
    initials: 'TF',
    when: '3d',
    body: 'row level scoping wired to okta groups. someone changes teams, their dashboards change with them. this used to be a quarterly cleanup ticket.',
    replies: 11,
    reposts: 57,
    likes: 402,
  },
  {
    name: 'Priya Raman',
    handle: '@praman',
    initials: 'PR',
    when: '5d',
    body: 'forecast review used to open with twenty minutes of reconciling two decks. now it opens with the forecast. small change, enormous difference.',
    replies: 5,
    reposts: 28,
    likes: 233,
  },
  {
    name: 'Sophie Lindqvist',
    handle: '@slindqvist',
    initials: 'SL',
    when: '1w',
    body: 'handed the auditors an exported change log instead of a shared folder and they were visibly confused about what to do with their afternoon.',
    replies: 31,
    reposts: 120,
    likes: 870,
  },
]

export function TestimonialSocialCards() {
  return (
    <section data-slot="testimonial-social-cards" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">In the wild</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Posted without being asked</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Unedited, including the one about the migration taking three weeks.
          </p>
        </div>

        {/* CSS columns give a masonry flow with no JS layout pass; cards use
            break-inside to avoid splitting across a column boundary. */}
        <div className="mt-10 gap-4 sm:columns-2 lg:columns-3">
          {posts.map((post) => (
            <Card key={post.handle} className="mb-4 break-inside-avoid">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">{post.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{post.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {post.handle} · {post.when}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed">{post.body}</p>

                <div className="text-muted-foreground mt-4 flex items-center gap-5 text-xs">
                  <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-1.5 py-1 text-xs font-normal">
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                    {post.replies}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-1.5 py-1 text-xs font-normal">
                    <Repeat2 className="size-3.5" aria-hidden="true" />
                    {post.reposts}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-1.5 py-1 text-xs font-normal">
                    <Heart className="size-3.5" aria-hidden="true" />
                    {post.likes}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
