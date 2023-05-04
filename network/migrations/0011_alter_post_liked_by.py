# Generated by Django 4.1.4 on 2023-04-19 00:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_post_liked_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='liked_by',
            field=models.ManyToManyField(related_name='postsliked', to=settings.AUTH_USER_MODEL),
        ),
    ]
