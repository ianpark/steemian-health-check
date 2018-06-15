python ./get_users.py
DATE=`date +%Y-%m-%d`
mkdir output/$DATE
python abuser.py --f user_list.txt -o output/$DATE/
aws s3 cp output/$DATE/ s3://health.steeme.com/output/$DATE/ --recursive
aws s3 cp output/metadata.json s3://health.steeme.com/output/

