from cafe_shtin.sbis_presto.presto import SbisPresto

from config import celery_app


@celery_app.task()
def update_menu():
    presto = SbisPresto()
    return presto.update_catalog_site()


@celery_app.task()
def update_balance():
    presto = SbisPresto()
    return presto.update_count_dishes_in_shop()
