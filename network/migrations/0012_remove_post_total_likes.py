# Generated by Django 4.1.2 on 2023-04-29 03:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_alter_post_liked_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='total_likes',
        ),
    ]
