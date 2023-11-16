import { AlertCircle } from "@/components/icons"

export default async function Page() {
    return (
        <div className="m-5 flex flex-row gap-x-5">
            <AlertCircle className="stroke-red-700"/>
            <p>
                <b>
                    Not Authorized
                </b>
            </p>
            <AlertCircle className="stroke-red-700"/>
        </div>
    )
}