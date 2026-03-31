import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
