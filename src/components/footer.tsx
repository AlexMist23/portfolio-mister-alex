import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import AMLogo from "./icons/am-logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-muted border-t-2 p-6">
      <div className="flex flex-col gap-4 mx-auto xl:container items-center text-sm text-foreground/50">
        <div className="flex gap-4 items-center mr-auto">
          <p>Project: Aleksander Misterkiewicz Portfolio</p>
          <a
            href="https://github.com/AlexMist23/portfolio-mister-alex"
            className="flex items-center gap-1 hover:text-foreground/80"
          >
            <GitHubLogoIcon />
            <p>Repository</p>
          </a>
        </div>
        <div className="flex w-full gap-4 items-center mr-auto border-t-2 border-muted/50 pt-4">
          <AMLogo className="h-5 text-foreground" />
          <p>© {new Date().getFullYear()} Aleksander Misterkiewicz</p>
          <a
            href="https://github.com/AlexMist23"
            className="flex items-center gap-1 hover:text-foreground/80"
          >
            <GitHubLogoIcon />
            <p>linkedin.com/in/aleksandermst</p>
          </a>
          <a
            href="https://www.linkedin.com/in/aleksandermst/"
            className="flex items-center gap-1 hover:text-foreground/80"
          >
            <LinkedInLogoIcon />
            <p>github.com/AlexMist23</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
