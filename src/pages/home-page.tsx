import LogoButton from "@/components/logo-button";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/issues-list-view/data-table";
import { columns } from "@/components/issues-list-view/columns";
import { issues } from "@/components/home-page/mock-issue-data";
import HomePageBoard from "@/components/home-page-board";
import ListViewCard from "@/components/home-page/list-view-card";
import BoardViewCard from "@/components/home-page/board-view-card";
import Footer from "@/components/home-page/footer";

export default function HomePage() {
  const [displayView, setDisplayView] = useState(true);

  useEffect(() => {
    document.title = "Boards";
  }, []);

  return (
    <div>
      <LogoButton />
      <div className="absolute right-4 top-4 flex gap-8 text-base md:right-8 md:top-8">
        <Button asChild variant="ghost">
          <Link className="text-foreground" to="/login">
            Log in
          </Link>
        </Button>
        <Button asChild>
          <Link className="text-foreground" to="/signup">
            Sign up
          </Link>
        </Button>
        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="pt-28 text-4xl font-medium text-foreground">
          Simplify Your Project Management
        </h1>
        <p className="mt-3 font-medium text-muted-foreground">
          Intuitive Issue Tracking and Collaborative Workflows
        </p>
        <div className="my-6 flex gap-4">
          <Button asChild>
            <Link to="/signup">Get started</Link>
          </Button>
          <Button variant="outline" className="text-foreground" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-10">
        <div onClick={() => setDisplayView(true)}>
          <ListViewCard displayed={displayView} />
        </div>
        <div onClick={() => setDisplayView(false)}>
          <BoardViewCard displayed={!displayView} />
        </div>
      </div>
      <Card className="mx-48 p-4">
        {displayView ? (
          <DataTable data={issues} columns={columns} homePage />
        ) : (
          <HomePageBoard issues={issues} />
        )}
      </Card>
      <Footer />
    </div>
  );
}
