import os
import shutil

source_base = r"D:\TrustLensAI\Datasets"
output_base = r"D:\TrustLensAI\merged_dataset"

classes = ['crack', 'scratch', 'stain', 'good']
splits = ['train', 'valid', 'test']

# Create folder structure
for split in splits:
    os.makedirs(f"{output_base}/{split}/images", exist_ok=True)
    os.makedirs(f"{output_base}/{split}/labels", exist_ok=True)

# Merge all classes
for cls in classes:
    for split in splits:
        img_src = f"{source_base}/{cls}/{split}/images"
        lbl_src = f"{source_base}/{cls}/{split}/labels"
        img_dst = f"{output_base}/{split}/images"
        lbl_dst = f"{output_base}/{split}/labels"

        if os.path.exists(img_src):
            for f in os.listdir(img_src):
                shutil.copy2(f"{img_src}/{f}", f"{img_dst}/{cls}_{f}")

        if os.path.exists(lbl_src):
            for f in os.listdir(lbl_src):
                shutil.copy2(f"{lbl_src}/{f}", f"{lbl_dst}/{cls}_{f}")

print("✅ Dataset merged successfully!")
