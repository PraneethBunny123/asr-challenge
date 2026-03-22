import { RecordsProvider } from "./context/RecordsContext";
import RecordList from "./components/RecordList";
import MainSection from "@/components/MainSection";

/**
 * The main Home page. It wraps the record list with the RecordsProvider
 * to supply global state and API functions. You can extend this page to
 * include additional context or summary information, such as charts or
 * aggregate metrics.
 */
export default function DashboardPage() {
  return (
    <RecordsProvider>
      <main>
        <MainSection />
        <RecordList />
      </main>
    </RecordsProvider>
  );
}
