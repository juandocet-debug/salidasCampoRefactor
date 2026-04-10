from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salidas_core', '0003_salidamodelo_color_salidamodelo_icono'),
    ]


    operations = [
        migrations.AddField(
            model_name='salidamodelo',
            name='resumen',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='relacion_syllabus',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='objetivo_general',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='objetivos_especificos',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='estrategia_metodologica',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='punto_partida',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='parada_max',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='criterios_evaluacion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salidamodelo',
            name='productos_esperados',
            field=models.TextField(blank=True, null=True),
        ),
    ]
