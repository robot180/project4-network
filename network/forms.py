from django import forms

from .models import *


#class ListingForm(forms.Form):
#    list_item = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Name', 'style': 'width: 300px;', 'class': 'form-control'}), label='Item', max_length=60, strip=True, required=True)
#    description = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Decription', 'style': 'width: 300px; height:400px;', 'class': 'form-control'}), label='Description', max_length=500, required=False)
#    current_bid = forms.DecimalField(decimal_places=2, min_value=0.00)
#    category = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Name', 'style': 'width: 300px;', 'class': 'form-control'}), label='Item', max_length=200, strip=True, required=True)
#    image = forms.ImageField()

class PostForm(forms.ModelForm):
    
    class Meta:

        model = Post
        fields = ['title', 'body' ]
        #class form control creates a uniform look on a form
        widgets = {
                    #'body': forms.TextInput(attrs={'class': 'form-control'}),
                    'body': forms.Textarea(attrs={'rows':6, 'maxlength': 1000, 'class': 'form-control'}),
                    'title': forms.TextInput(attrs={'rows':1, 'maxlength': 300, 'class': 'form-control'}),
                    }
        labels = {
            #change the label name of form fields instead of using default one from models.py
            "title": "Title",
            "body": "New Post",
        }
