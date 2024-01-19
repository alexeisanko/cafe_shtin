from django.contrib.auth.models import AbstractUser, UserManager
from django.contrib.auth.hashers import make_password
from django.db import models
from django.urls import reverse


class MyUserManage(UserManager):

    def __init__(self):
        super(MyUserManage, self).__init__()

    def _create_user(self, username, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        user = self.model(username=username, **extra_fields)
        if password:
            user.password = make_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    """
    Default custom user model for Site TestoPesto.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    #: First and last name do not cover name patterns around the globe
    phone = models.CharField(verbose_name="Номер телефона", max_length=255, unique=True)
    uuid = models.UUIDField(verbose_name='Идентификатор в СБИС престо', unique=True, null=True)
    username = models.CharField(verbose_name='Имя пользователя', max_length=50)
    password = models.CharField(verbose_name='Пароль', max_length=128, null=True)
    cashback = models.IntegerField(verbose_name="Накопленный кешбек", blank=True, default=0)
    birthday = models.DateField(verbose_name="День рождения", null=True)
    first_name = None  # type: ignore
    last_name = None  # type: ignore
    email = None  # type: ignore
    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = 'phone'
    objects = MyUserManage()

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})


class AddressUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField(verbose_name='Адрес доставки')
