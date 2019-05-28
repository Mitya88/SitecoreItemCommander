using MikeRobbins.EntityServiceDemo.Models;
using Sitecore.Data.Items;

namespace MikeRobbins.EntityServiceDemo.Interfaces
{
    public interface INewsMapper
    {
        NewsArticle GetNewsArticle(Item item);
    }
}