namespace ECommerceAPI.DTOs
{
  public class CartItemDto
  {
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
  }
}
