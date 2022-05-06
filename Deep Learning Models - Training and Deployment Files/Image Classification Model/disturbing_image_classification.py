import fastbook
import fastai
from fastbook import *
from fastai.vision.widgets import *

image_types = 'important', 'unimportant'
path = Path("D:\Data Science Projects\Whatsapp disturbance\Datasets\Data")

if not path.exists():
    path.mkdir()
    for o in image_types:
        dest = (path/o)
        dest.mkdir(exist_ok=True)
        results = search_images_bing(key, f'{o}')
        download_images(dest, urls=results.attrgot('content_url'))

fns = get_image_files(path)
failed = verify_images(fns)

images = DataBlock(
    blocks=(ImageBlock, CategoryBlock),
    get_items=get_image_files,
    splitter=RandomSplitter(valid_pct=0.2, seed=42),
    get_y=parent_label,
    item_tfms=Resize(128))

dls = images.dataloaders(path)
dls.valid.show_batch(max_n=4, nrows=1)

images = images.new(
    item_tfms=RandomResizedCrop(224, min_scale=0.5),
    batch_tfms=aug_transforms())
dls = images.dataloaders(path)


learn = cnn_learner(dls, resnet34, metrics=error_rate)
learn.fine_tune(4)

interp = ClassificationInterpretation.from_learner(learn)
interp.plot_confusion_matrix()

interp.plot_top_losses(5, nrows=5)

learn.export(fname = 'image_classification.pkl')