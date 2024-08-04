export function Footer() {
  return (
    <footer className="flex flex-col pt-8 md:pt-10">
      <span className="text-sm text-muted-foreground md:text-center">
        © 2024{" "}
        <a
          href="https://github.com/ndinata"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Nico Dinata
        </a>
        .
      </span>
    </footer>
  );
}
