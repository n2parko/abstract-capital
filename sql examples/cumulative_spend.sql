with 

daily as (
  select date, sum(amount) daily_spending
  from prototype.transactions_view
  where date > '2020-07-31'
  and amount > 0
  group by 1 
  order by 1 
)

select date, sum(daily_spending) OVER (ORDER BY date)
from daily
order by 1 