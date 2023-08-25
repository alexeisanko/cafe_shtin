from typing import Any, Dict

from django.views.generic import TemplateView

from cafe_shtin.delivery.utilities import get_actual_menu, is_open, is_breakfast_time


class HomeView(TemplateView):
    template_name = 'pages/home.html'
    breakfast_menu, main_menu = get_actual_menu()

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        menu_breakfast, menu_main = get_actual_menu(min_count=10)
        context['menu_breakfast'] = menu_breakfast
        context['menu_main'] = menu_main
        context['is_open']: bool = is_open()
        context['is_breakfast_time']: bool = is_breakfast_time()
        return context


home_view = HomeView.as_view()


class BasketView(TemplateView):
    pass


basket_view = BasketView.as_view()


class AboutView(TemplateView):
    pass


about_view = AboutView.as_view()
