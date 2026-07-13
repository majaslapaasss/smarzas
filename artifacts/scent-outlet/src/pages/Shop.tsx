import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const initialGender = searchParams.get('gender') as any;
  const initialCategory = searchParams.get('category');
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gender, setGender] = useState<string | undefined>(initialGender || undefined);
  const [category, setCategory] = useState<string | undefined>(initialCategory || undefined);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state with URL params on initial load/nav
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('gender');
    const c = params.get('category');
    if (g) setGender(g);
    if (c) setCategory(c);
  }, [location]);

  const { data: products, isLoading: isLoadingProducts } = useListProducts({
    search: debouncedSearch || undefined,
    gender: gender as any,
    category: category || undefined,
  });

  const { data: categories } = useListCategories();

  const handleClearFilters = () => {
    setSearch('');
    setGender(undefined);
    setCategory(undefined);
  };

  const hasFilters = search || gender || category;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-foreground">Gender</h3>
        <Select value={gender || "all"} onValueChange={(val) => setGender(val === "all" ? undefined : val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-sm text-foreground">Scent Family</h3>
        <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? undefined : val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Scents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scents</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name} ({c.productCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={handleClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Explore our curated selection of fragrances. Use the filters to find your perfect scent.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search fragrances..."
              className="pl-9 bg-secondary/30 border-transparent focus-visible:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border pr-8">
          <div className="sticky top-24">
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="aspect-square bg-secondary rounded-2xl"></div>
                  <div className="h-4 bg-secondary rounded w-2/3"></div>
                  <div className="h-6 bg-secondary rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-secondary/20 rounded-3xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-6">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-2">No fragrances found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <Button onClick={handleClearFilters} variant="outline" className="rounded-full">
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
