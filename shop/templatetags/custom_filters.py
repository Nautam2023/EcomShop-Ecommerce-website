from django import template

register = template.Library()


@register.filter
def format_price(value):
    """
    Custom template filter to format prices with commas.
    """
    try:
        price = float(value)
        if price.is_integer():
            return f"{price:,.2f}"
        else:
            return f"{price:,.2f}"
    except (ValueError, TypeError):
        return value  # Return original value if conversion fails
