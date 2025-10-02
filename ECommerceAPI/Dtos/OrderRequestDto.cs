public class OrderRequestDto
{
  public CustomerDto Customer { get; set; } = new CustomerDto();
  public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
  public decimal Total { get; set; }
}

public class CustomerDto
{
  public string FullName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Address { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string PostalCode { get; set; } = string.Empty;
  public string Country { get; set; } = string.Empty;
}
