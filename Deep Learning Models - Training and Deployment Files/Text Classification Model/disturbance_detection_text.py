from google.colab import drive
drive.mount('/content/drive')

import numpy as np
import pandas as pd

from pathlib import Path
from typing import *

import torch
import torch.optim as optim

import gc
gc.collect()

!pip install pretrainedmodels

# Commented out IPython magic to ensure Python compatibility.
# %reload_ext autoreload
# %autoreload 2
# %matplotlib inline

!pip install fastai==1.0.52

import fastai

!pip install torch==1.1.0

!pip install torchvision==0.3.0

from fastai import *
#from fastai.vision import *
from fastai.text import *

#from torchvision.models import *
import pretrainedmodels

#from utils import *
import sys

from fastai.callbacks.tracker import EarlyStoppingCallback
from fastai.callbacks.tracker import SaveModelCallback

# Commented out IPython magic to ensure Python compatibility.
# %%bash
# pip install pytorch-pretrained-bert

from pytorch_pretrained_bert import BertTokenizer
bert_tok = BertTokenizer.from_pretrained(
    "bert-base-uncased",
)

class FastAiBertTokenizer(BaseTokenizer):
    """Wrapper around BertTokenizer to be compatible with fast.ai"""
    def __init__(self, tokenizer: BertTokenizer, max_seq_len: int=128, **kwargs):
        self._pretrained_tokenizer = tokenizer
        self.max_seq_len = max_seq_len

    def __call__(self, *args, **kwargs):
        return self

    def tokenizer(self, t:str) -> List[str]:
        """Limits the maximum sequence length"""
        return ["[CLS]"] + self._pretrained_tokenizer.tokenize(t)[:self.max_seq_len - 2] + ["[SEP]"]

from sklearn.model_selection import train_test_split

df = pd.read_csv('/content/drive/MyDrive/Combined_Dataset.csv', index_col=0)

df.head()

df.dtypes

df['label_maj'] = df['label_maj'].astype(str)

df.dtypes

res = pd.get_dummies(df['label_maj'])

res.dtypes

res = res.astype(str)

df = pd.concat([df, res], axis=1, join='inner')

label_cols = df.label_maj.unique()

label_cols

df.drop('label_maj', axis=1, inplace=True)

df

df.dtypes

train,val = train_test_split(df, shuffle=True, test_size=0.2, random_state=42)

train.head()

val.head()

fastai_bert_vocab = Vocab(list(bert_tok.vocab.keys()))

fastai_tokenizer = Tokenizer(tok_func=FastAiBertTokenizer(bert_tok, max_seq_len=256), pre_rules=[], post_rules=[])

df.dtypes

lab = label_cols.tolist()

lab

train.head()

databunch_1 = TextDataBunch.from_df(".", train, val, 
                  tokenizer=fastai_tokenizer,
                  vocab=fastai_bert_vocab,
                  include_bos=False,
                  include_eos=False,
                  text_cols="message",
                  label_cols=lab,
                  bs=32,
                  collate_fn=partial(pad_collate, pad_first=False, pad_idx=0),
             )

class BertTokenizeProcessor(TokenizeProcessor):
    def __init__(self, tokenizer):
        super().__init__(tokenizer=tokenizer, include_bos=False, include_eos=False)

class BertNumericalizeProcessor(NumericalizeProcessor):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, vocab=Vocab(list(bert_tok.vocab.keys())), **kwargs)

def get_bert_processor(tokenizer:Tokenizer=None, vocab:Vocab=None):
    """
    Constructing preprocessors for BERT
    We remove sos/eos tokens since we add that ourselves in the tokenizer.
    We also use a custom vocabulary to match the numericalization with the original BERT model.
    """
    return [BertTokenizeProcessor(tokenizer=tokenizer),
            NumericalizeProcessor(vocab=vocab)]

class BertDataBunch(TextDataBunch):
    @classmethod
    def from_df(cls, path:PathOrStr, train_df:DataFrame, valid_df:DataFrame, test_df:Optional[DataFrame]=None,
                tokenizer:Tokenizer=None, vocab:Vocab=None, classes:Collection[str]=None, text_cols:IntsOrStrs=1,
                label_cols:IntsOrStrs=0, label_delim:str=None, **kwargs) -> DataBunch:
        "Create a `TextDataBunch` from DataFrames."
        p_kwargs, kwargs = split_kwargs_by_func(kwargs, get_bert_processor)
        # use our custom processors while taking tokenizer and vocab as kwargs
        processor = get_bert_processor(tokenizer=tokenizer, vocab=vocab, **p_kwargs)
        if classes is None and is_listy(label_cols) and len(label_cols) > 1: classes = label_cols
        src = ItemLists(path, TextList.from_df(train_df, path, cols=text_cols, processor=processor),
                        TextList.from_df(valid_df, path, cols=text_cols, processor=processor))
        src = src.label_for_lm() if cls==TextLMDataBunch else src.label_from_df(cols=label_cols, classes=classes)
        if test_df is not None: src.add_test(TextList.from_df(test_df, path, cols=text_cols))
        return src.databunch(**kwargs)

databunch_2 = BertDataBunch.from_df(".", train_df=train, valid_df=val,
                  tokenizer=fastai_tokenizer,
                  vocab=fastai_bert_vocab,
                  text_cols="message",
                  label_cols=lab,
                  bs=8,
                  collate_fn=partial(pad_collate, pad_first=False, pad_idx=0),
             )

databunch_2.show_batch()

from pytorch_pretrained_bert.modeling import BertConfig, BertForSequenceClassification, BertForNextSentencePrediction, BertForMaskedLM
bert_model_class = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)

loss_func = nn.BCEWithLogitsLoss()

acc_02 = partial(accuracy_thresh, thresh=0.8)

model = bert_model_class

from fastai.callbacks import *

learner = Learner(
    databunch_2, model,
    loss_func=loss_func, model_dir='/temp/model', metrics=acc_02,
)

def bert_clas_split(self) -> List[nn.Module]:
    
    bert = model.bert
    embedder = bert.embeddings
    pooler = bert.pooler
    encoder = bert.encoder
    classifier = [model.dropout, model.classifier]
    n = len(encoder.layer)//3
    print(n)
    groups = [[embedder], list(encoder.layer[:n]), list(encoder.layer[n+1:2*n]), list(encoder.layer[(2*n)+1:]), [pooler], classifier]
    return groups

x = bert_clas_split(model)

learner.split([x[0], x[1], x[2], x[3], x[5]])

#learner.lr_find()

#learner.recorder.plot()

learner.fit_one_cycle(2, max_lr=slice(1e-5, 5e-4), moms=(0.8,0.7), pct_start=0.2, wd =(1e-7, 1e-5, 1e-4, 1e-3, 1e-2))

learner.save('/content/drive/MyDrive/im-text-best-model.pkl')

learner.load('/content/drive/MyDrive/MIM_App/im-text-best-model.pkl')
#learner.save_encoder('/content/drive/MyDrive/ml/best-model')

learner.data.valid_dl = databunch_2.valid_dl
preds, y = learner.get_preds(ds_type=DatasetType.Valid)

y = torch.tensor(y,dtype=torch.long)
acc = acc_02(preds, y)

y_max = torch.argmax(y,dim=1)
preds_max = torch.argmax(preds,dim=1)

y_max[8]

from sklearn.metrics import *

recall_score(y_max, preds_max)

accuracy_score(y_max, preds_max)

y_max.shape

from fastai import *

def accuracy_multi(inp, targ, thresh=0.5, sigmoid=True):
    "Compute accuracy when `inp` and `targ` are the same size."
    inp,targ = flatten_check(inp,targ)
    if sigmoid: inp = inp.sigmoid()
    return ((inp>thresh)==targ.bool()).float().mean()

print(accuracy_multi(preds,y))

interp = ClassificationInterpretation.from_learner(learner)
interp.plot_confusion_matrix()

learner.cat

text1_dis = "You have won ?1,000 cash or a ?2,000 prize!"
text2_dis = "World Cup Football is arriving.....Be careful"
text1_not_dis = "Hey I need some help with the assignment."
text2_not_dis = "The paper review is next week."

learner.predict(text1_dis)

learner.predict(text2_dis)

learner.predict(text1_not_dis)

learner.predict(text2_not_dis)

text = "Good morning"
learner.predict(text)

np.argmax((learner.predict(text))[1])

import csv

test_df = pd.read_csv('/content/drive/MyDrive/ml/test.csv',escapechar = "\\", quoting = csv.QUOTE_NONE)

df.BROWSE_NODE_ID.value_counts()

test_df.head()

test_df['PRODUCT_ID']

test_df['BROWSER_NODE_ID'] = ''

test_df.drop('DESCRIPTION', axis=1, inplace=True)

test_df.drop('BULLET_POINTS', axis=1, inplace=True)
test_df.drop('BRAND', axis=1, inplace=True)

pred=[]

for index, row in df.iterrows():
    pred.append(np.argmax((learner.predict(text))[2]))

prd = pd.DataFrame(pred)

prd['0'].unique()

prd.head(-50)

submission = pd.merge(prd, test_df['PRODUCT_ID'], )

submission = pd.concat([prd, test_df['PRODUCT_ID']], axis=1, join='inner')

submission

submission.to_csv