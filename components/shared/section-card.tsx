import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  className?: string
  badge?: string
}

export function SectionCard({ title, description, href, icon, className, badge }: SectionCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn("group h-full transition-all hover:shadow-md hover:border-primary/30 cursor-pointer", className)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {icon}
            </div>
            {badge && (
              <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{badge}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle className="text-base mb-1 group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
