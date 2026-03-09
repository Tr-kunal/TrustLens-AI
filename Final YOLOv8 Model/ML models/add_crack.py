import os
import shutil

crack_base = r"D:\TrustLensAI\Datasets\crack"
output_base = r"D:\TrustLensAI\merged_dataset"

splits = ['train', 'valid', 'test']

for split in splits:
    img_src = f"{crack_base}/{split}/images"
    lbl_src = f"{crack_base}/{split}/labels"
    img_dst = f"{output_base}/{split}/images"
    lbl_dst = f"{output_base}/{split}/labels"

    # Copy images
    if os.path.exists(img_src):
        for f in os.listdir(img_src):
            shutil.copy2(f"{img_src}/{f}", f"{img_dst}/crack_{f}")
        print(f"✅ Copied {split} crack images")
    else:
        print(f"❌ {split}/images not found")

    # Copy labels
    if os.path.exists(lbl_src):
        for f in os.listdir(lbl_src):
            shutil.copy2(f"{lbl_src}/{f}", f"{lbl_dst}/crack_{f}")
        print(f"✅ Copied {split} crack labels")
    else:
        print(f"❌ {split}/labels not found")

print("\n✅ Crack files added to merged_dataset!")
