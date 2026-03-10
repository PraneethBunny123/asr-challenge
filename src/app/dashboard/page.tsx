import { RecordsProvider } from "./context/RecordsContext";
import RecordList from "./components/RecordList";
import UserAvatar from "./components/UserAvatar";

/**
 * The main Home page. It wraps the record list with the RecordsProvider
 * to supply global state and API functions. You can extend this page to
 * include additional context or summary information, such as charts or
 * aggregate metrics.
 */
export default function DashboardPage() {
  return (
    <RecordsProvider>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Review &amp; Annotation Task</h1>
            <p className="text-muted-foreground">
              Use this interface to review incoming records, adjust their
              status, and leave notes. The data is served by a mock API.
            </p>
          </div>
          <UserAvatar />
        </div>

        <RecordList />
      </div>
    </RecordsProvider>
  );
}
