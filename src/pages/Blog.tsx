import { NavigationPrimary } from "@/components/NavigationPrimary";
import { FooterPrimary } from "@/components/FooterPrimary";
import { Separator } from "@/components/ui/separator";

const Blog = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <main id="main-content" className="container mx-auto px-4 lg:px-6 py-10">
        <h1 className="text-3xl font-heading mb-4 tracking-brand">Blog</h1>
        <Separator className="mb-6" />
        <p className="text-muted-foreground">This is the Blog page. Replace with brand content.</p>
      </main>
      <FooterPrimary />
    </div>
  );
};

export default Blog;

