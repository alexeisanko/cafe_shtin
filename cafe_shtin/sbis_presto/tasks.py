from cafe_shtin.sbis_presto.presto import SbisPresto

from config import celery_app
import logging


@celery_app.task()
def update_menu():
    logging.info('Начало обновления меню')
    presto = SbisPresto()
    presto.update_catalog_site()
    return logging.info('Меню обновлено')


@celery_app.task()
def update_balance():
    presto = SbisPresto()
    return presto.update_count_dishes_in_shop()
