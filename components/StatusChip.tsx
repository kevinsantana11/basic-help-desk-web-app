import { Enums } from "@/utils/supabase/database.types";

export default function StatusChip({ status }: { status: Enums<'Status'> }) {
  let statusClasses = ['rounded', 'p-1']
  switch (status) {
    case 'NEW':
      statusClasses.push('bg-yellow-700')
      break;
    case 'IN-PROGRESS':
      statusClasses.push('bg-blue-700')
      break;
    case 'RESOLVED':
      statusClasses.push('bg-green-700')
      break;
  }

  return (
    <div className="flex">
      <div className={statusClasses.join(" ")}>
        <p>
          <b>
          {status}
          </b>
        </p>
      </div>
    </div>
  )
}