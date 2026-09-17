import Story from '../../components/story/Story'
import { ProjectRoadmap } from '@react-registry-blocks/project-roadmap/ProjectRoadmap'

export default function ProjectRoadmapDemo() {
  return (
    <Story
      title="Project Roadmap & Gantt Schedule"
      description="Full-featured project deliverables surface with metrics summary, search & assignee filters, multi-scale timeline, interactive task sheets, and Add Task modal."
    >
      <ProjectRoadmap />
    </Story>
  )
}
