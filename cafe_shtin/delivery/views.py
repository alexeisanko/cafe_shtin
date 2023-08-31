from typing import Any, Dict

from django.views.generic import TemplateView

from cafe_shtin.delivery.utilities import get_actual_menu, is_open


class HomeView(TemplateView):
    template_name = 'pages/home.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        menu = get_actual_menu(min_count=10)
        context['menu'] = menu
        context['is_open']: bool = is_open()
        return context


home_view = HomeView.as_view()


class BasketView(TemplateView):
    pass


basket_view = BasketView.as_view()


class AboutView(TemplateView):
    pass


about_view = AboutView.as_view()
