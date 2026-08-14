import Story from '../../components/story/Story'
import { EmployeeOrgChartTree } from '@react-registry-blocks/employee-org-chart-tree/EmployeeOrgChartTree'

export default function EmployeeOrgChartTreeDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Interactive enterprise organizational hierarchy tree with manager reporting lines, team counts, multi-level expandable branches, department filter pills, employee search, and an employee profile quick info drawer."
      >
        <EmployeeOrgChartTree />
      </Story>

      <Story
        title="Engineering Department Focus"
        description="Pre-filtered view highlighting the Engineering department with 64 engineers across platform architecture, frontend infrastructure, and SRE."
      >
        <EmployeeOrgChartTree initialDepartment="Engineering" />
      </Story>

      <Story
        title="Search Query Filter"
        description="Pre-populated search query targeting systems architects and distributed data roles with matching employee highlighting."
      >
        <EmployeeOrgChartTree initialSearch="Architect" />
      </Story>

      <Story
        title="Selected Staff Lead Profile"
        description="Pre-selected employee profile showing Staff Frontend Lead Sofia Rossi with reporting line, direct reports roster, and core skills."
      >
        <EmployeeOrgChartTree initialSelectedId="emp-eng-lead-2" />
      </Story>

      <Story
        title="Collapsed Hierarchy View"
        description="Executive level hierarchy with collapsed director branches ready for interactive on-demand expansion."
      >
        <EmployeeOrgChartTree initialExpandedIds={['emp-ceo']} />
      </Story>
    </>
  )
}
